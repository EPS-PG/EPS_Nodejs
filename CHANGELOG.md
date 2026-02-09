# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-17

### Added
- Initial release of EPS Gateway Node.js SDK
- Payment initialization with full parameter support
- Transaction verification (by merchant ID or EPS transaction ID)
- HMACSHA512 hash generation utility
- Automatic JWT token management with caching
- TypeScript support with full type definitions
- Input validation for all parameters
- Comprehensive error handling with custom EPSError class
- Sandbox and production environment support
- Product list support for multiple items
- Custom value fields (valueA, valueB, valueC, valueD)
- Transaction ID generator utility
- Complete examples with Express.js integration
- Full documentation with API reference
- Unit tests for hash utilities
- GitHub Actions CI/CD workflow
- ESLint and Prettier configuration

### Features
- ✅ Promise-based API with async/await
- ✅ Zero external dependencies (except axios)
- ✅ Automatic token refresh
- ✅ Request timeout configuration
- ✅ Bangladesh phone number validation
- ✅ Email and URL validation
- ✅ UUID format validation for merchant/store IDs
- ✅ Quick payment status check method
- ✅ Configuration masking for security

## [Unreleased]

### Planned
- Webhook/IPN handler
- Payment status polling with retry
- Bulk payment verification
- Transaction history export
- Mock mode for testing without API calls
- Rate limiting support
- Detailed logging options
- Payment analytics helpers
- Refund API support (when available)
