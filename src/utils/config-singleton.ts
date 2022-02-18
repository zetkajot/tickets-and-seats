import 'dotenv/config';

export default class ConfigSingleton {
  private static instance: ConfigSingleton;

  public static getConfig() {
    if (!ConfigSingleton.instance) {
      ConfigSingleton.initializeConfig();
    }
    return ConfigSingleton.instance;
  }

  private static initializeConfig() {
    ConfigSingleton.instance = new ConfigSingleton(
      {
        host: process.env.MARIADB_HOST as string,
        port: +(process.env.MARIADB_PORT as string),
        user: process.env.MARIADB_USER as string,
        password: process.env.MARIADB_PASS as string,
        database: process.env.MARIADB_DB as string,
      },
      {
        port: +(process.env.EXPRESS_PORT as string),
      },
    );
  }

  private constructor(
    public readonly mariadbConfig: MariaDBConfig,
    public readonly expressConfig: ExpressConfig,
  ) {}
}

type MariaDBConfig = {
  host: string,
  port: number,
  user: string,
  password: string,
  database: string,
};

type ExpressConfig = {
  port: number;
};
