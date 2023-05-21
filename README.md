# Test-Navigos-Search

## Extensions required

- Prettier - Code formatter
- ESLint

Source Code Structor:

```
- .env                // config env: url, api ...
- .eslintignore
- .eslintrc.js
- .gitignore
- .prettierignore
- .prettierrc
- package.json
- README.md
- tsconfig.json
- webpack.config.js
- README.md
- public/
  - index.html
- src/
  - index.tsx
  - stores.ts         // define type store && merge store
  - components/
    - Notification/
      - store.tsx     // wrapper ant notification
      - constant.tsx  // config default
    - ChatInput/
      - index.tsx     // UI ChatInput
      - style.scss
    - ChatMessages/
      - index.tsx     // UI ChatMessages
      - style.scss
    - PrivateChat/
      - Input.tsx     // reuse ChatInput
      - Messages.tsx  // reuse ChatMessages
      - index.tsx     // UI Private Chat
    - GroupChat/
      - Input.tsx     // reuse ChatInput
      - Messages.tsx  // reuse ChatMessages
      - index.tsx     // UI Group Chat
    - SearchBar/      // component search member by text
      - index.tsx     // UI searchBar
      - helper.ts
      - type.ts       // type props component SearchBar
      - style.scss
    - FileUpload/     // component control upload file
      - index.tsx     // UI component FileUpload
      - store.ts      // control upload file
      - helper.ts     // format, check valid file
      - type.ts       // props type component & type store
      - constant.ts   // default init data store & constant value
      - style.scss
  - pages/
    - Chat/
      - index.tsx     // UI chat page
      - store.ts      // control action vs function init, clear
      - helper.ts     // map data in store call api to view
      - type.ts       // type store & type chat page
      - constant.ts   // init data store, ...
      - style.scss    // style for chat page
    - index.tsx       // layout & router
  - assets/
    - images/         // all images
  - common/
    - store.ts        // api call & wrap api, function clear all store (support for auth & clear data)
    - type.ts         // type store, type response - request
    - constant.ts     // constant url api, init data store common
    - helpers.ts
    - socket.ts       // config vs handle chat by socket.io
  - styles/
    - index.scss
    - variables.scss
- server              // node server
  - index.js          // mock socket server
  - package.json      // package node server
```
