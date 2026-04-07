# Testing Patterns

**Analysis Date:** 2026-04-07

## Test Framework

**Status:** No testing framework configured or detected

**Runner:**
- Not applicable - no test runner (Jest, Vitest, Mocha, etc.) found

**Assertion Library:**
- Not applicable - no assertion library (expect, assert, chai, etc.) in use

**Test Files:**
- No test files detected (no `*.test.js`, `*.spec.js`, `*.test.ts`, `*.spec.ts` files found)

**Run Commands:**
- No test commands available in `package.json` (file not present in repository)
- Manual testing required for all functionality

## Test File Organization

**Current State:**
- No tests currently written for the project
- Single source file: `/d/gitlab/GIS/main.js` contains all application logic
- No test directory structure exists

**Recommended Structure (for future implementation):**
```
/d/gitlab/GIS/
├── main.js                    # Source code
├── style.css
├── index.html
├── __tests__/                 # Suggested test directory
│   ├── auth.test.js           # Authentication tests
│   ├── dashboard.test.js       # Dashboard navigation tests
│   ├── ui.test.js             # UI state management tests
│   └── integration.test.js     # Full flow tests
```

## Code Sections Requiring Tests

**Authentication (`main.js` lines 76-103):**
- Login form submission with valid credentials
- Login form submission with invalid credentials
- Error message display on authentication failure
- Session storage of token and login state
- Token removal on logout

**View Management (`main.js` lines 125-155):**
- `showLoginView()` - Hides/shows correct DOM elements
- `showDashboardSelection()` - Shows dashboard grid
- `showDashboard()` - Loads correct dashboard config
- Error handling for missing dashboards
- Back navigation from dashboard view

**Session Persistence (`main.js` lines 71-73):**
- User already logged in (sessionStorage check) shows dashboard selection
- Logout clears sessionStorage properly
- Page reload with existing session loads correct view

**Dashboard Card Click Handlers (`main.js` lines 117-122):**
- Dashboard card click triggers correct dashboard load
- Data attribute `data-dashboard-id` correctly read
- All 12 dashboard configurations accessible

## Mocking Requirements

**What to Mock:**
- `fetch()` API calls - Mock response from `https://backend-app-113139671688.southamerica-east1.run.app/api/auth/login`
- `sessionStorage` - Mock for testing session state persistence
- DOM elements - Mock HTMLElement methods for visibility changes (classList.add/remove)
- `alert()` - Mock for dashboard not found scenario

**What NOT to Mock:**
- CSS class manipulation (classList.add, classList.remove) - integration tests should verify UI state
- DOM element selectors (getElementById, querySelectorAll) - use real DOM or minimal DOM library
- Event listeners - test actual event trigger behavior

**Mock Example Pattern:**
```javascript
// Mock fetch for authentication
jest.mock('global', () => ({
  fetch: jest.fn(),
}));

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = mockSessionStorage;
```

## Test Structure

**Suite Organization:**
- Group tests by feature (authentication, navigation, state management)
- Use descriptive test names reflecting user behavior
- Separate unit tests (function behavior) from integration tests (full flows)

**Suggested Pattern:**
```javascript
describe('Authentication', () => {
  beforeEach(() => {
    // Reset DOM, mocks, sessionStorage
    document.body.innerHTML = `
      <form id="login-form">
        <input id="username" />
        <input id="password" />
      </form>
      <div id="login-error"></div>
    `;
    jest.clearAllMocks();
  });

  describe('Login Form Submission', () => {
    test('should send POST request with username and password', async () => {
      // Arrange
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ token: 'test-token' })
      });

      // Act
      const form = document.getElementById('login-form');
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'https://backend-app-113139671688.southamerica-east1.run.app/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: '', password: '' })
        })
      );
    });

    test('should store token in sessionStorage on success', async () => {
      // Arrange
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ token: 'test-token' })
      });

      // Act
      const form = document.getElementById('login-form');
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('loggedIn', 'true');
    });

    test('should show error message on authentication failure', async () => {
      // Arrange
      fetch.mockResolvedValue({
        ok: false,
        json: async () => ({})
      });

      // Act
      const form = document.getElementById('login-form');
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      const errorDiv = document.getElementById('login-error');
      expect(errorDiv.classList.contains('hidden')).toBe(false);
    });

    test('should show error message on fetch error', async () => {
      // Arrange
      fetch.mockRejectedValue(new Error('Network error'));

      // Act
      const form = document.getElementById('login-form');
      form.dispatchEvent(new Event('submit'));
      await new Promise(resolve => setTimeout(resolve, 0));

      // Assert
      const errorDiv = document.getElementById('login-error');
      expect(errorDiv.classList.contains('hidden')).toBe(false);
    });
  });

  describe('Logout', () => {
    test('should remove session data and show login view', () => {
      // Arrange
      const logoutBtn = document.getElementById('logout-btn');

      // Act
      logoutBtn.click();

      // Assert
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('loggedIn');
      const loginView = document.getElementById('login-view');
      expect(loginView.classList.contains('hidden')).toBe(false);
    });
  });
});

describe('Dashboard Navigation', () => {
  describe('Dashboard Card Click', () => {
    test('should load dashboard when card clicked', () => {
      // Arrange
      const card = document.querySelector('[data-dashboard-id="estudo-a"]');

      // Act
      card.click();

      // Assert
      const dashboardView = document.getElementById('dashboard-view');
      expect(dashboardView.classList.contains('hidden')).toBe(false);
      
      const title = document.getElementById('dashboard-title');
      expect(title.textContent).toBe('Hospital Center Clínicas');
      
      const iframe = document.getElementById('powerbi-iframe');
      expect(iframe.src).toContain('eyJrIjoiNjJhZjcyYjAtYzI4Ni00NDVmLWE3NmUtNDk1MjA4YTY4ZmVlIiwidCI6');
    });

    test('should show error for invalid dashboard ID', () => {
      // Arrange
      const config = { dashboards: { 'estudo-a': { title: 'Test', url: 'http://test' } } };
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      showDashboard('invalid-id');

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('Dashboard not found:', 'invalid-id');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Back Navigation', () => {
    test('should return to dashboard selection view', () => {
      // Arrange
      const backBtn = document.getElementById('back-btn');

      // Act
      backBtn.click();

      // Assert
      const dashboardSelectionView = document.getElementById('dashboard-selection-view');
      expect(dashboardSelectionView.classList.contains('hidden')).toBe(false);
      
      const dashboardView = document.getElementById('dashboard-view');
      expect(dashboardView.classList.contains('hidden')).toBe(true);
    });
  });
});

describe('Session Persistence', () => {
  test('should show dashboard selection if already logged in', () => {
    // Arrange
    mockSessionStorage.getItem.mockImplementation(key => {
      if (key === 'loggedIn') return 'true';
      return null;
    });

    // Act
    document.addEventListener('DOMContentLoaded', function() {
      if (sessionStorage.getItem('loggedIn') === 'true') {
        showDashboardSelection();
      }
    });
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Assert
    const dashboardSelectionView = document.getElementById('dashboard-selection-view');
    expect(dashboardSelectionView.classList.contains('hidden')).toBe(false);
  });
});
```

## Coverage

**Requirements:** No coverage enforcement currently in place

**Recommended Target:** 80%+ coverage for critical paths (authentication, navigation)

**View Coverage:**
```bash
# Once testing framework is added, run:
npm test -- --coverage
```

## Test Types

**Unit Tests:**
- Test individual functions: `showDashboard()`, `showLoginView()`, etc.
- Test configuration object structure
- Test error handling in try-catch blocks
- Scope: Single function behavior with mocked dependencies

**Integration Tests:**
- Test complete login flow (form submission → token storage → view change)
- Test dashboard navigation flow (card click → load dashboard → back navigation)
- Test session persistence flow (login → reload → dashboard shown)
- Scope: Multiple functions working together

**E2E Tests:**
- Not currently in use
- Recommended tools if needed: Playwright, Cypress, Puppeteer
- Test scenarios: Full user login, dashboard selection, dashboard viewing workflows

## Async Testing

**Pattern for Fetch Calls:**
```javascript
test('should handle async login', async () => {
  // Mock fetch to resolve after delay
  fetch.mockImplementation(() => 
    new Promise(resolve => 
      setTimeout(() => resolve({
        ok: true,
        json: async () => ({ token: 'test' })
      }), 10)
    )
  );

  // Dispatch event and wait for async operations
  form.dispatchEvent(new Event('submit'));
  
  // Wait for all pending promises to resolve
  await new Promise(resolve => setTimeout(resolve, 0));

  // Assert after async completion
  expect(sessionStorage.setItem).toHaveBeenCalledWith('loggedIn', 'true');
});
```

## Error Testing

**Pattern for Error Scenarios:**
```javascript
test('should display error on network failure', async () => {
  // Simulate network error
  fetch.mockRejectedValue(new Error('Network error'));

  // Trigger login
  form.dispatchEvent(new Event('submit'));
  await new Promise(resolve => setTimeout(resolve, 0));

  // Verify error UI state
  const errorElement = document.getElementById('login-error');
  expect(errorElement.classList.contains('hidden')).toBe(false);
  expect(errorElement.textContent).toBe('Credenciais inválidas. Tente novamente.');
});

test('should handle missing dashboard gracefully', () => {
  // Mock console to verify error logging
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  
  // Trigger with invalid dashboard ID
  showDashboard('nonexistent');

  // Verify error handling
  expect(consoleSpy).toHaveBeenCalledWith('Dashboard not found:', 'nonexistent');
  expect(alert).toHaveBeenCalledWith('Dashboard não encontrado.');

  consoleSpy.mockRestore();
});
```

## Test Data

**Dashboard Configuration:**
Located in `main.js` lines 4-56 - 12 dashboard configurations used as test data

**Suggested Test Fixtures:**
```javascript
// Mock configuration for testing
const mockConfig = {
  dashboards: {
    'test-dashboard': {
      title: 'Test Hospital',
      url: 'https://app.powerbi.com/view?r=test-token'
    }
  }
};

// Mock credentials for login tests
const testCredentials = {
  validUser: { username: 'user', password: 'pass' },
  invalidUser: { username: 'invalid', password: 'wrong' }
};
```

## Implementation Recommendation

**Priority Order for Test Coverage:**
1. Authentication module (highest risk - handles credentials and API integration)
2. View state management (critical for UX)
3. Dashboard navigation (core feature)
4. Session persistence (prevents auth regressions)

**Suggested Test Framework Stack:**
- Runner: Jest or Vitest (compatible with vanilla JavaScript)
- Assertion: Jest built-in expect() or Chai
- DOM Testing: Testing Library or jsdom
- HTTP Mocking: Jest mocks or MSW (Mock Service Worker)

**Estimated Test Count for Full Coverage:**
- Authentication: 8-10 tests
- View Management: 6-8 tests
- Navigation: 4-6 tests
- Session Persistence: 2-3 tests
- **Total: ~20-27 test cases**

---

*Testing analysis: 2026-04-07*
