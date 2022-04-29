import React from 'react';
import styles from './App.module.css';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Auth from './components/Auth'; 
import MainPage from './components/MainPage';
import StateContextProvider from './context/StateContext';

const httpLink = createHttpLink({
  uri: "http://127.0.0.1:8000/graphql/",
  credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <StateContextProvider>
        <div className={styles.app}>
          <BrowserRouter>
            <Routes>
              <Route index element={<Auth />} />
              <Route path="employees" element={<MainPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </StateContextProvider>
    </ApolloProvider>
  );
}

export default App;
