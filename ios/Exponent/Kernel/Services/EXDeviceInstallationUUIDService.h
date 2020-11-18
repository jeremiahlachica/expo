// Copyright 2015-present 650 Industries. All rights reserved.

#import <Foundation/Foundation.h>
#import <ABI39_0_0ExpoKit/ABI39_0_0EXConstantsBinding.h>
#import <ABI38_0_0ExpoKit/ABI38_0_0EXConstantsBinding.h>
#import <ABI37_0_0ExpoKit/ABI37_0_0EXConstantsBinding.h>

NS_ASSUME_NONNULL_BEGIN

// A kernel service allowing versioned expo-constants to access device installation UUID
@interface EXDeviceInstallationUUIDService : NSObject <ABI37_0_0EXConstantsDeviceInstallationUUIDManager, ABI38_0_0EXConstantsDeviceInstallationUUIDManager, ABI39_0_0EXConstantsDeviceInstallationUUIDManager>

@end

NS_ASSUME_NONNULL_END
