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
        hostname: process.env.MARIADB_HOST as string,
        port: +(process.env.MARIADB_PORT as string),
        username: process.env.MARIADB_USER as string,
        password: process.env.MARIADB_PASS as string,
        database: process.env.MARIADB_DB as string,
      },
    );
  }

  private constructor(
    public readonly mariadbConfig: MariaDBConfig,
  ) {}
}

type MariaDBConfig = {
  hostname: string,
  port: number,
  username: string,
  password: string,
  database: string,
};
