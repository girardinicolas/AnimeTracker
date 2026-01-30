import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'it' | 'en';

const translations = {
    it: {
        subtitle: "La tua collezione personale",
        description: "Tieni traccia delle tue serie preferite con uno stile mozzafiato.",
        randomizer: "Casuale",
        addAnime: "Aggiungi Anime",
        watching: "In Corso",
        planned: "Da Vedere",
        history: "Cronologia",
        sortBy: "Ordina per:",
        recent: "Recenti",
        oldest: "Meno recenti",
        title: "Titolo A-Z",
        noAnime: "Nessun anime trovato",
        startAdding: "Inizia a riempire la tua lista aggiungendo il tuo primo anime!",
        startNow: "Inizia ora",
        season: "Stagione",
        currentEp: "Ep. Corrente",
        totalEp: "Ep. Totali",
        status: "Stato",
        editSeries: "Modifica Serie",
        newAnime: "Nuovo Anime",
        updateProgress: "Aggiorna il tuo progresso",
        addToCollection: "Aggiungi alla collezione",
        saveChanges: "Salva Modifiche",
        deleteConfirm: "Sei sicuro di voler eliminare questo anime?",
        syncMal: "Sincronizza con MAL",
        episodio: "Episodio",
        developedBy: "Sviluppato con passione da",
        allRightsReserved: "Tutti i diritti riservati.",
        installApp: "Installa App",
        login: "Accedi",
        register: "Registrati",
        email: "Email",
        password: "Password",
        noAccount: "Non hai un account? Registrati",
        haveAccount: "Hai già un account? Accedi",
        loadingAuth: "Caricamento...",
        logout: "Esci",
        checkSpam: "Controlla anche la cartella spam per l'email di conferma!",
    },
    en: {
        subtitle: "Your personal collection",
        description: "Track your favorite series with breathtaking style.",
        randomizer: "Randomizer",
        addAnime: "Add Anime",
        watching: "Watching",
        planned: "To Watch",
        history: "History",
        sortBy: "Sort by:",
        recent: "Recent",
        oldest: "Oldest",
        title: "A-Z Title",
        noAnime: "No anime found",
        startAdding: "Start filling your list by adding your first anime!",
        startNow: "Start now",
        season: "Season",
        currentEp: "Current Ep",
        totalEp: "Total Ep",
        status: "Status",
        editSeries: "Edit Series",
        newAnime: "New Anime",
        updateProgress: "Update your progress",
        addToCollection: "Add to Collection",
        saveChanges: "Save Changes",
        deleteConfirm: "Are you sure you want to delete this anime?",
        syncMal: "Sync with MAL",
        episodio: "Episode",
        developedBy: "Developed with passion by",
        allRightsReserved: "All rights reserved.",
        installApp: "Install App",
        login: "Login",
        register: "Register",
        email: "Email",
        password: "Password",
        noAccount: "Don't have an account? Register",
        haveAccount: "Already have an account? Login",
        loadingAuth: "Loading...",
        logout: "Logout",
        checkSpam: "Also check your spam folder for the confirmation email!",
    }
};

type TranslationKey = keyof typeof translations.it;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('app-language');
        return (saved as Language) || 'it';
    });

    useEffect(() => {
        localStorage.setItem('app-language', language);
    }, [language]);

    const t = (key: TranslationKey) => translations[language][key] || key;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
};
