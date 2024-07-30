# env-wizard

This application is a simple wizard that helps you to create and manage your environment variables.

## Installation

```bash
$ npm install -g env-wizard
```

## Features

Creates the **.env** file and the **test.env** file with the variables you define.

```bash
$ npx env-wizard generate
```

Now you can add your variables to the **test.env** file and run the following command to load them into your environment. The **test.env** will be read the the variables you set will be loaded into your environment.

```bash
$ npx env-wizard generate --missing
```

## Contributing

Author of the project is [Robert Julian Kratz](https://github.com/robert-kratz). Feel free to contribute to the project by opening an issue or a pull request. You can contact be via my Website [rjks.us](https://rjks.us).
