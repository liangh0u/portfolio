#import <AppKit/AppKit.h>
#import <AVFoundation/AVFoundation.h>
#import <math.h>
#import <CoreText/CoreText.h>
CGImageRef load(NSString *name) { NSImage *im=[[NSImage alloc] initWithContentsOfFile:[@"assets/interaction/" stringByAppendingString:name]]; return CGImageRetain([im CGImageForProposedRect:NULL context:nil hints:nil]); }
double ease(double p) { p=fmin(1,fmax(0,p)); return p*p*(3-2*p); }
// Trim transparent padding so every character's visible feet share the same baseline.
void sprite(CGContextRef c,CGImageRef im,double t,double x,double y,double w,double h,int phase) {
    static NSMutableDictionary *frames; if(!frames) frames=[NSMutableDictionary dictionary];
    int fw=(int)CGImageGetWidth(im)/6, f=((int)(t*10)+phase)%6;
    NSString *key=[NSString stringWithFormat:@"%p-%d",im,f];
    NSValue *cached=frames[key]; CGImageRef crop;
    if(cached) { crop=[cached pointerValue]; }
    else {
        CGImageRef raw=CGImageCreateWithImageInRect(im,CGRectMake(f*fw,0,fw,CGImageGetHeight(im)));
        NSBitmapImageRep *rep=[[NSBitmapImageRep alloc] initWithCGImage:raw];
        NSInteger minX=rep.pixelsWide,minY=rep.pixelsHigh,maxX=0,maxY=0;
        for(NSInteger py=0;py<rep.pixelsHigh;py++) for(NSInteger px=0;px<rep.pixelsWide;px++) {
            if([rep colorAtX:px y:py].alphaComponent>.1) { minX=MIN(minX,px);minY=MIN(minY,py);maxX=MAX(maxX,px);maxY=MAX(maxY,py); }
        }
        crop=CGImageCreateWithImageInRect(raw,CGRectMake(minX,minY,maxX-minX+1,maxY-minY+1));
        CGImageRelease(raw); frames[key]=[NSValue valueWithPointer:crop];
    }
    double drawnWidth=h*CGImageGetWidth(crop)/CGImageGetHeight(crop);
    CGContextDrawImage(c,CGRectMake(x+(w-drawnWidth)/2,y,drawnWidth,h),crop);
}
int main() { @autoreleasepool {
NSURL *fontURL=[NSURL fileURLWithPath:@"assets/fonts/Pixer-Regular.ttf"];
CTFontManagerRegisterFontsForURL((__bridge CFURLRef)fontURL,kCTFontManagerScopeProcess,NULL);
CGDataProviderRef fontData=CGDataProviderCreateWithURL((__bridge CFURLRef)fontURL);
CGFontRef pixelFont=CGFontCreateWithDataProvider(fontData);
NSString *fontName=CFBridgingRelease(CGFontCopyPostScriptName(pixelFont));
NSFont *disFont=[NSFont fontWithName:fontName size:64];
NSCAssert(disFont!=nil,@"Pixer font must load for DIS");
CGFontRelease(pixelFont); CGDataProviderRelease(fontData);
CGImageRef bg=load(@"escape-8bit/background.png"),title=load(@"title/welcome-title-yellow-blue.png"),player=load(@"escape-8bit/player-run-v8-raised.png"),chi=load(@"escape-8bit/chi-run-restored.png"),uist=load(@"escape-8bit/uist-run-v2.png");
NSArray *names=@[@"award-red-dot.png",@"award-if.png",@"award-idea.png",@"award-adesign.png",@"publication-design-studies.png"];
CGImageRef icons[5]; for(int i=0;i<5;i++) icons[i]=load([@"icons/" stringByAppendingString:names[i]]);
NSURL *url=[NSURL fileURLWithPath:@"assets/interaction/video/home-intro.mp4"];
[[NSFileManager defaultManager] removeItemAtURL:url error:nil];
NSError *error=nil; AVAssetWriter *writer=[[AVAssetWriter alloc] initWithURL:url fileType:AVFileTypeMPEG4 error:&error];
AVAssetWriterInput *input=[AVAssetWriterInput assetWriterInputWithMediaType:AVMediaTypeVideo outputSettings:@{AVVideoCodecKey:AVVideoCodecTypeH264,AVVideoWidthKey:@1280,AVVideoHeightKey:@440,AVVideoCompressionPropertiesKey:@{AVVideoAverageBitRateKey:@3500000}}];
AVAssetWriterInputPixelBufferAdaptor *ad=[AVAssetWriterInputPixelBufferAdaptor assetWriterInputPixelBufferAdaptorWithAssetWriterInput:input sourcePixelBufferAttributes:@{(id)kCVPixelBufferPixelFormatTypeKey:@(kCVPixelFormatType_32ARGB),(id)kCVPixelBufferWidthKey:@1280,(id)kCVPixelBufferHeightKey:@440,(id)kCVPixelBufferCGImageCompatibilityKey:@YES,(id)kCVPixelBufferCGBitmapContextCompatibilityKey:@YES}];
[writer addInput:input]; writer.shouldOptimizeForNetworkUse=YES; [writer startWriting]; [writer startSessionAtSourceTime:kCMTimeZero];
for(int f=0;f<390;f++) { @autoreleasepool {
while(!input.readyForMoreMediaData) { if(writer.status==AVAssetWriterStatusFailed) { NSLog(@"%@",writer.error); return 1; } [NSThread sleepForTimeInterval:.002]; }
CVPixelBufferRef pixel; CVPixelBufferPoolCreatePixelBuffer(NULL,ad.pixelBufferPool,&pixel); CVPixelBufferLockBaseAddress(pixel,0);
CGColorSpaceRef cs=CGColorSpaceCreateDeviceRGB(); CGContextRef c=CGBitmapContextCreate(CVPixelBufferGetBaseAddress(pixel),1280,440,8,CVPixelBufferGetBytesPerRow(pixel),cs,kCGImageAlphaNoneSkipFirst); CGColorSpaceRelease(cs); CGContextSetInterpolationQuality(c,kCGInterpolationNone);
double t=f/30.0;
// Start well behind the group and steadily gain throughout the chase.
// Close the iris only once the player is within catching distance of CHI.
double chase=fmin(t/8,1);
double groupX=t<8?-600+1470*(t/8):870+130*fmin((t-8)/4,1);
double x=groupX-190+265*chase; CGContextSetRGBFillColor(c,0,0,0,1); CGContextFillRect(c,CGRectMake(0,0,1280,440)); CGContextSaveGState(c);
if(t>=8) { double fullRadius=hypot(x+127,289); double r=t<10?fullRadius+(48-fullRadius)*ease((t-8)/2):48*(1-ease((t-10)/2)); CGContextAddEllipseInRect(c,CGRectMake(x+127-r,151-r,2*r,2*r)); CGContextClip(c); }
// One enlarged background covers the full shot, with no tiled joins.
CGContextDrawImage(c,CGRectMake(-80-t*24,-12,1800,600),bg);
// Restore the flying Red Dot and iF awards, including their pixel trails.
for(int award=0;award<2;award++) {
    double duration=award==0?5.4:6.2;
    double phase=fmod(t+(award==0?0:2.7),duration)/duration;
    double ax=1330-1450*phase;
    double ay=62+305*(.5+.5*cos(phase*4*M_PI+award*2.1));
    double flutter=((int)(t/.14)%2)*4;
    CGContextSaveGState(c);
    CGContextSetAlpha(c,fmin(1,fmin(phase/.04,(1-phase)/.07)));
    for(int puff=0;puff<4;puff++) {
        CGContextSetRGBFillColor(c,1,1,1,1-puff*.17);
        CGContextFillRect(c,CGRectMake(round(ax+29+puff*10+flutter),round(ay+8+(puff%2)*7),10-puff,10-puff));
    }
    CGContextDrawImage(c,CGRectMake(round(ax),round(ay),28,28),icons[award]);
    CGContextRestoreGState(c);
}
CGContextDrawImage(c,CGRectMake(380,160+5*sin(t*2*M_PI/2.8),520,288),title);
[NSGraphicsContext saveGraphicsState]; [NSGraphicsContext setCurrentContext:[NSGraphicsContext graphicsContextWithCGContext:c flipped:NO]];
NSDictionary *style=@{NSFontAttributeName:[NSFont monospacedSystemFontOfSize:11 weight:NSFontWeightBold],NSForegroundColorAttributeName:NSColor.whiteColor};
[@"AWARDS" drawAtPoint:NSMakePoint(16,410) withAttributes:style]; [@"PUBLICATION" drawAtPoint:NSMakePoint(106,410) withAttributes:style];
NSArray *counts=@[@"4",@"3",@"2",@"3",@"1"];
for(int i=0;i<5;i++) { double ix=i==4?106:16,iy=i==4?384:384-i*23; CGContextDrawImage(c,CGRectMake(ix,iy,18,18),icons[i]); [counts[i] drawAtPoint:NSMakePoint(ix+24,iy+2) withAttributes:style]; }
sprite(c,player,t,x,44,210,200,0); sprite(c,chi,t,groupX+230,44,125,100,0); sprite(c,uist,t,groupX+390,44,145,100,2);
// Hard-edged gray extrusion and outline, matching the pixel reference.
CGContextSetShouldAntialias(c,false);
NSColor *edge=[NSColor colorWithCalibratedRed:.45 green:.50 blue:.53 alpha:1];
NSColor *shadow=[NSColor colorWithCalibratedRed:.33 green:.41 blue:.46 alpha:1];
// Draw the legs first so their upper edges sit behind the lettering.
for(int pass=0;pass<3;pass++) {
    double dx=pass==0?5:0,dy=pass==0?-4:0;
    CGContextSetStrokeColorWithColor(c,(pass==0?shadow:pass==1?edge:NSColor.whiteColor).CGColor);
    CGContextSetLineWidth(c,pass==2?8:14);
    for(int leg=0;leg<2;leg++) {
        double lx=groupX+604+leg*20;
        CGContextMoveToPoint(c,lx+dx,96+dy);
        CGContextAddLineToPoint(c,lx+sin(t*20+leg*M_PI)*20+dx,51+dy);
        CGContextStrokePath(c);
    }
}
NSDictionary *outline=@{NSFontAttributeName:disFont,NSForegroundColorAttributeName:shadow,NSStrokeColorAttributeName:shadow,NSStrokeWidthAttributeName:@(-9)};
[@"DIS" drawAtPoint:NSMakePoint(groupX+575,88) withAttributes:outline];
[@"DIS" drawAtPoint:NSMakePoint(groupX+570,92) withAttributes:@{NSFontAttributeName:disFont,NSForegroundColorAttributeName:NSColor.whiteColor,NSStrokeColorAttributeName:edge,NSStrokeWidthAttributeName:@(-7)}];
[@"DIS" drawAtPoint:NSMakePoint(groupX+570,92) withAttributes:@{NSFontAttributeName:disFont,NSForegroundColorAttributeName:NSColor.whiteColor}];
[NSGraphicsContext restoreGraphicsState];
CGContextSetShouldAntialias(c,true);
CGContextRestoreGState(c);
if(f==0||f==120||f==180||f==210||f==225||f==240||f==270||f==330||f==360) { CGImageRef shot=CGBitmapContextCreateImage(c); NSBitmapImageRep *rep=[[NSBitmapImageRep alloc] initWithCGImage:shot]; [[rep representationUsingType:NSBitmapImageFileTypePNG properties:@{}] writeToFile:[NSString stringWithFormat:@"/private/tmp/intro-%d.png",f] atomically:YES]; CGImageRelease(shot); }
CGContextRelease(c); CVPixelBufferUnlockBaseAddress(pixel,0); BOOL ok=[ad appendPixelBuffer:pixel withPresentationTime:CMTimeMake(f,30)]; CVPixelBufferRelease(pixel); if(!ok) { NSLog(@"%@",writer.error); return 1; }
} }
[input markAsFinished]; dispatch_semaphore_t sem=dispatch_semaphore_create(0); [writer finishWritingWithCompletionHandler:^{dispatch_semaphore_signal(sem);}]; dispatch_semaphore_wait(sem,DISPATCH_TIME_FOREVER); NSLog(@"Finished: %ld %@",(long)writer.status,writer.error); return writer.status==AVAssetWriterStatusCompleted?0:1;
} }
