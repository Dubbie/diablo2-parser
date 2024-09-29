# Diablo 2 Parser

## Overview

The **Diablo 2 Parser** is a tool designed to parse and analyze item data from the game Diablo 2. It helps players understand item stats, build strategies, and optimize their gameplay.

## Features

-   **Item Parsing**: Extracts item data from the game's .txt files.
-   **User Interface**: Built with Vue.js for a smooth user experience.
-   **Real-Time Stats**: Displays real-time stats based on equipped items.
-   **Modular Architecture**: Easy to extend and maintain.

## Installation

To get started with the Diablo 2 Parser, follow these steps:

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/Dubbie/diablo2-parser.git
    cd diablo2-parser
    ```

2. **Set Up with ddev**:

    Make sure you have [ddev](https://ddev.readthedocs.io/en/stable/) installed, then run:

    ```bash
    ddev start
    ```

3. **Access the Application**:

    Open your browser and navigate to the URL provided by ddev (usually `http://diablo2-parser.ddev.site`).

## Usage

1. Import your item data by running `ddev php artisan migrate:fresh --seed`
2. Use the interface to create and manage your builds.
3. Explore parsed items and their stats in real-time.

## Documentation

For more detailed information about setup, usage, and contribution guidelines, please refer to the [wiki](https://github.com/Dubbie/diablo2-parser/wiki).

## Contributing

Contributions are welcome! Please see the [Contributing Guidelines](CONTRIBUTING.md) for details on how to get involved.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact Information

If you have any questions or feedback, feel free to reach out:

-   **Email**: [miho.dnl@gmail.com](mailto:miho.dnl@gmail.com)
-   **Discord**: Subesz@subesz
