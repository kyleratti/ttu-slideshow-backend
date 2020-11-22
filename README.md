# ttu-slideshow-backend

- [ttu-slideshow-backend](#ttu-slideshow-backend)
- [Configuration](#configuration)
  - [Example](#example)

# Configuration

For ease-of-use, the config file is loaded from a `config.json` file. This allows you to easily update settings without having to touch environment variables or `.env` files (which Windows, by default, does not care to open).

There are several environment variables required for this application to work.

| Variable   | Type     | Description                                                                                                                                                  | Example                              |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| `watchDir` | `string` | Full path to the folder to watch. This is where images are pulled from. **Note that backslashes need to be entered twice in order to escape the character.** | `C:\\Users\\MyUser\\Dropbox\\live\\` |

## Example

Please see the included [config.example.json](config.example.json).

```json
{
  "watchDir": "C:\\Users\\MyUser\\Dropbox\\live\\"
}
```
