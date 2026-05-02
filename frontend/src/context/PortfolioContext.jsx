import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [holdings, setHoldings] = useState([]);
    const [summary, setSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchPortfolio();
            fetchTransactions();
        }
    }, [user]);

    const fetchPortfolio = async () => {
        try {
            const response = await api.get('/portfolio');
            setHoldings(response.data.holdings);
            setSummary(response.data.summary);
        } catch (error) {
            console.error("Failed to fetch portfolio", error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/transactions');
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        }
    };

    const addTransaction = async (data) => {
        setLoading(true);
        try {
            await api.post('/transactions', data);
            await fetchPortfolio();
            await fetchTransactions();
            return true;
        } catch (error) {
            console.error("Transaction failed", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const refreshPrices = async () => {
        try {
            await api.post('/market/prices');
            await fetchPortfolio(); // Re-fetch updated portfolio
        } catch (error) {
            console.error("Failed to refresh prices", error);
        }
    };

    return (
        <PortfolioContext.Provider value={{ holdings, summary, transactions, loading, addTransaction, refreshPrices }}>
            {children}
        </PortfolioContext.Provider>
    );
};
