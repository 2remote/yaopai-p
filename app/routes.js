import React from 'react'
import { Route, IndexRedirect } from 'react-router'

export const loginRoute = (
  <Route path="/login" comment="登录注册" />
)

export const accountRoute = (
  <Route path="account">
    <IndexRedirect to="info" />
    <Route path="info" />
    <Route path="basic" />
    <Route path="detail" />
    <Route path="password" />
  </Route>
)

export const mainRoute = (
  <Route path="main" />
)

export const photographerRoute = (
  <Route path="photographer">
    <Route path="info" />
    <Route path="auth" />
    <Route path="upload" />
    <Route path="albums" />
  </Route>
)

export const makeupartistRoute = (
  <Route path="makeupartist">
    <Route path="info" />
    <Route path="auth" />
    <Route path="upload" />
    <Route path="albums" />
  </Route>
)
