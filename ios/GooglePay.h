
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNGooglePaySpec.h"

@interface GooglePay : NSObject <NativeGooglePaySpec>
#else
#import <React/RCTBridgeModule.h>

@interface GooglePay : NSObject <RCTBridgeModule>
#endif

@end
