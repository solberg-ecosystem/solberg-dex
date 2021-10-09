# Serum DEX UI

An implementation of a UI for the Serum DEX.

### Running the UI

Run `yarn` to install dependencies, then run `yarn start` to start a development server or `yarn build` to create a production build that can be served by a static file server. Note that prior to compiling you need to add charts yourself (see below).

### Collect referral fees

If you are hosting a public UI using this codebase, you can collect referral fees when your users trade through your site.

To do so, set the `REACT_APP_USDT_REFERRAL_FEES_ADDRESS` and `REACT_APP_USDC_REFERRAL_FEES_ADDRESS` environment variables to the addresses of your USDT and USDC SPL token accounts.

You may want to put these in local environment files (e.g. `.env.development.local`, `.env.production.local`). See the [documentation](https://create-react-app.dev/docs/adding-custom-environment-variables) on environment variables for more information.
