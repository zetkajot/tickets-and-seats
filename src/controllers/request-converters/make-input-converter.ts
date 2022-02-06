import ErrorFactory from '../../error/error-factory';
import InvalidRequestError from '../errors/invalid-request-error';
import { ControllerRequest } from '../types/controller-request';

type ComplexConverterFactorySetting = {
  argumentName: string,
  desiredName?: string,
  valueConverter?: ValueConverter
};

type ValueConverter = (value: string) => any;

type ConverterFactorySettings = (ComplexConverterFactorySetting | string)[];

type Converter = (request: ControllerRequest) => any;

export default function makeInputConverter(...settings: ConverterFactorySettings): Converter {
  const settingsMap = getSettingsMap(settings);
  return function inputConverter(request: ControllerRequest) {
    const { args } = request;

    if (args.length < settingsMap.size) {
      throw ErrorFactory.getInstance().makeError(InvalidRequestError);
    }

    const returnedObject: { [k:string]: any } = {};

    const usedArgNames = new Set<string>();

    args.forEach(({ name, value }) => {
      if (usedArgNames.has(name)) {
        throw ErrorFactory.getInstance().makeError(InvalidRequestError);
      }
      const argSetting = settingsMap.get(name);
      if (argSetting) {
        returnedObject[argSetting.desiredName] = argSetting.valueConverter(value);
        usedArgNames.add(name);
      }
    });

    if (usedArgNames.size !== settingsMap.size) {
      throw ErrorFactory.getInstance().makeError(InvalidRequestError);
    }

    return returnedObject;
  };
}

function getSettingsMap(
  settings: ConverterFactorySettings,
): Map<string, { desiredName: string, valueConverter: ValueConverter }> {
  const settingsMap = new Map<string, { desiredName: string, valueConverter: ValueConverter }>();

  settings.forEach((setting) => {
    const argName = getArgumentNameFromSetting(setting);
    settingsMap.set(argName, {
      desiredName: getDesiredNameFromSetting(setting),
      valueConverter: getValueConverterFromSetting(setting),
    });
  });

  return settingsMap;
}

function getArgumentNameFromSetting(setting: string | ComplexConverterFactorySetting): string {
  return typeof setting === 'string' ? setting : setting.argumentName;
}

function getDesiredNameFromSetting(setting: string | ComplexConverterFactorySetting): string {
  return typeof setting === 'string' ? setting : setting.desiredName ?? setting.argumentName;
}

function getValueConverterFromSetting(
  setting: string | ComplexConverterFactorySetting,
): ValueConverter {
  const fakeConverter = (value: string) => value;
  return typeof setting === 'string' ? fakeConverter : setting.valueConverter ?? fakeConverter;
}
