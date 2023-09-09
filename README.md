![x](assets/figs/readme.svg)
<a href="https://sotopia-chatbot.vercel.app">
  <h1 align="center">Sotopia Chatbot</h1>
</a>

<p align="center">
  Chat interface for interacting with agents or humans in <a href="https://github.com/sotopia-lab/sotopia"> Sotopia.</a>
</p>

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).