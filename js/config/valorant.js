export const VALORANT = {
  degreesPerCount: 0.07,
  horizontalFov: 103,
  sensitivityKey: 'EAresFloatSettingName::MouseSensitivity',
};

const CM_PER_INCH = 2.54;

export const cmPer360 = (sensitivity, dpi) =>
  (360 / (sensitivity * VALORANT.degreesPerCount) / dpi) * CM_PER_INCH;
