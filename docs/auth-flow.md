# Authentication Flow Documentation

This document describes the end-to-end authentication process involving **User**, **Client App**, **Auth Server**, and **Token Store**. The system uses **Access Tokens** for authorization and **Refresh Tokens** for reissuing access when expired.

## ![auth-flow](/assets/auth-flow.png)

## 1. Login Flow

### 1.1 User Initiates Login

1. **Enter Credentials**
   The user enters their **username** and **password** in the client application.

2. **Submit Login Request**
   The client app sends the credentials to the **Auth Server** for validation.

---

### 1.2 Auth Server Validation

- **If credentials are valid**:
  1. **Store Tokens** in the **Token Store** (both access and refresh tokens).
  2. Respond to the client with:
     - Access Token
     - Refresh Token

  3. Client app **securely stores tokens** (e.g., in secure storage or memory).

- **If credentials are invalid**:
  - Respond with an **authentication error**.

---

## 2. Normal API Usage

### 2.1 Sending Requests

For each API request:

1. Client sends the **access token** in the request headers to the API.
2. Auth server verifies the access token.

---

### 2.2 Token Validation

- **If Access Token is valid**:
  - Respond with the requested data.

- **If Access Token is expired/invalid**:
  1. Check if a refresh token is available:
     - **If yes** → proceed to token refresh.
     - **If no** → prompt user to log in again.

---

## 3. Token Refresh Flow

### 3.1 Refresh Token Request

1. Client sends a request to `/refresh` endpoint with the **refresh token**.
2. Auth Server validates the refresh token.

---

### 3.2 Refresh Token Validation

- **If valid**:
  1. **Rotate tokens** — issue new access and refresh tokens.
  2. Store the new tokens in the **Token Store**.
  3. Update tokens on the client side.
  4. Retry the original API request with the **new access token**.
  5. Respond with the requested data.

- **If expired/invalid**:
  - Respond with **authentication error**.
  - Prompt user to log in again.

---

## 4. Logout Flow

### 4.1 User Logs Out

1. User clicks **logout** in the client app.
2. Client app sends a **logout request** to the Auth Server to revoke tokens.

---

### 4.2 Token Revocation

1. Auth Server revokes both **access** and **refresh tokens** in the **Token Store**.
2. Auth Server confirms logout.
3. Client app updates the UI to **logged out state**.

---

## 5. Key Notes

- **Access Token**: Short-lived; used for API requests.
- **Refresh Token**: Longer-lived; used only to obtain new access tokens when expired.
- **Token Rotation**: On refresh, old tokens are invalidated, and new ones are issued for better security.
- **Secure Storage**: Tokens should be stored in a secure manner to prevent theft (e.g., HTTP-only cookies, secure keychain).
- **Error Handling**:
  - Invalid access token → try refresh.
  - Invalid refresh token → force re-login.

---

## 6. Sequence Overview

1. **Login** → Store & return tokens.
2. **Use API** → Validate access token or refresh if expired.
3. **Token Refresh** → Rotate & update tokens.
4. **Logout** → Revoke tokens & clear session.
