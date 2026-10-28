# Quillora

A university library in the browser. Quillora — *Where Knowledge Finds Its Wings* — is a Vite + React app with a gothic reading room: sign in, borrow, explore research, ask the desk assistant, and keep a reading profile.

Everything lives in this browser. Accounts, loans, profile edits, and the assistant transcript are stored in `localStorage`. There is no server.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints.

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Run Oxlint |

## Demo

On the sign-in page, choose **Use Harshini’s demo account**.

- Email: `harshini@quillora.edu`
- Password: `library`

Any non-empty email and password will also sign in. Choose **Librarian** to open the circulation desk. Creating an account stops on the verification screen; **Enter the library** continues, and a librarian can approve borrowing.

## Walk through

Landing collage, sign in, create account, dashboard, borrowings, research explorer, full-screen book search and book details, AI library assistant, reading challenges, and profile editing.
