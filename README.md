# eventick-react-native

A [React Native](http://facebook.github.io/react-native/) app for using [Eventick's](https://www.eventick.com.br/) check in API.

### Setup

Follow React Native's ["Getting Started"](http://facebook.github.io/react-native/docs/getting-started.html) guide to set up your development environment.

### Development

1. Clone the repository:

  ```sh
  $ git clone https://github.com/devbeers/eventick-react-native.git
  ```

2. Install dependencies:

  ```sh
  $ npm install
  ```

3. Run:

  ```sh
  # For iOS
  react-native run-ios

  # For Android
  react-native run-android
  ```

  Alternatively, open `ios/reactEventick.xcodeproj` for iOS development.
  
### Deployment

1. Build the js bundle file:

  ```sh
  $ react-native bundle --platform ios --dev false --entry-file index.ios.js --bundle-output iOS/main.jsbundle
  ```
  
2. Open `ios/reactEventick.xcodeproj` and edit the scheme to use the `Release` configuration.