# Contributing to EPS Gateway Node.js SDK

Thank you for considering contributing to this project! Suggestions, improvements, and pull requests are always welcome.

## Code of Conduct

Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, OS, etc.)
- Error messages and stack traces

### Suggesting Features

Feature requests are welcome! Please create an issue describing:
- The feature and its benefits
- Use cases
- Any implementation ideas you have

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/imtiaznajim/eps-gateway-nodejs.git
   cd eps-gateway-nodejs
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Make your changes**
   - Write clear, concise code
   - Follow existing code style
   - Add comments for complex logic
   - Update TypeScript types if needed

5. **Test your changes**
   ```bash
   npm run build    # Must pass
   npm test         # Run tests
   npm run lint     # Check code style
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: Add amazing feature"
   ```

   Use conventional commit messages:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `test:` Adding or updating tests
   - `refactor:` Code refactoring
   - `chore:` Maintenance tasks

7. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

8. **Open a Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Explain why the change is needed

## Development Guidelines

### Code Style

- Use TypeScript for all source files
- Follow existing code structure
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage

### Documentation

- Update README.md if adding new features
- Add examples for new functionality
- Update CHANGELOG.md
- Keep comments up to date

## Project Structure

```
eps-gateway-nodejs/
├── src/
│   ├── EPS.ts              # Main SDK class
│   ├── index.ts            # Entry point
│   ├── types/
│   │   └── index.ts        # TypeScript definitions
│   └── utils/
│       ├── hash.ts         # Hash utilities
│       └── validator.ts    # Input validation
├── tests/                  # Unit tests
├── examples/               # Usage examples
└── dist/                   # Compiled output
```

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion on GitHub Discussions
- Contact the maintainer: imtiaznajim@gmail.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
