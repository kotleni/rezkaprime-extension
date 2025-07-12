import './popup.css';
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {DeleteIcon} from '../components/delete-icon';

const defaultDomains: string[] = [
    'hdrezka.ag',
    'hdrezka.cm',
    'hdrezka.me',
    'hdrezka.co',
];

interface Prefs {
    savedDomains: string[];
}

class ExtensionPrefs {
    private prefs: Prefs = {savedDomains: []};

    async load() {
        const results = await (chrome || browser).storage.local.get();
        this.prefs = results;

        // Set default domains if no any domains
        if (!this.prefs.savedDomains) {
            this.prefs.savedDomains = defaultDomains;
            await this.save();
        }
    }

    async save() {
        await (chrome || browser).storage.local.set(this.prefs);
    }

    get savedDomains(): string[] {
        return this.prefs.savedDomains;
    }

    saveDomain(domain: string) {
        this.prefs.savedDomains.push(domain);
    }

    forgetDomain(domain: string) {
        this.prefs.savedDomains = this.prefs.savedDomains.filter(
            d => d !== domain,
        );
    }
}

interface ButtonProps {
    onClick: () => void;
    title: string;
}

function Button(props: ButtonProps) {
    return (
        <span onClick={props.onClick} className="rezka-button">
            {props.title}
        </span>
    );
}

function Popup() {
    const [extensionPrefs, setExtensionPrefs] = useState<
        ExtensionPrefs | undefined
    >();

    const [isDomainRegistered, setIsDomainRegistered] = useState(false);
    const [savedDomains, setSavedDomains] = useState<string[]>([]);
    const [currentPageDomain, setCurrentPageDomain] = useState('');

    const updateCurrentPageDomain = async () => {
        const [tab] = await (chrome || browser).tabs.query({
            active: true,
            currentWindow: true,
        });
        const url = tab.url;
        if (!url) {
            return;
        }
        const domain = new URL(url).hostname;
        setIsDomainRegistered(savedDomains.includes(domain));
        setCurrentPageDomain(domain);
    };

    const addCurrentDomain = async () => {
        if (!currentPageDomain) {
            return;
        }

        extensionPrefs!.saveDomain(currentPageDomain);
        setSavedDomains(extensionPrefs!.savedDomains);
        await extensionPrefs!.save();

        void updateCurrentPageDomain();
    };

    const deleteDomain = async (domain: string) => {
        extensionPrefs!.forgetDomain(domain);
        setSavedDomains(extensionPrefs!.savedDomains);
        await extensionPrefs!.save();
    };

    useEffect(() => {
        void updateCurrentPageDomain();
    }, [savedDomains]);

    useEffect(() => {
        const extensionPrefs = new ExtensionPrefs();
        extensionPrefs
            .load()
            .then(() => {
                setExtensionPrefs(extensionPrefs);
                setSavedDomains(extensionPrefs.savedDomains);
            })
            .catch(console.error);
    }, []);

    return (
        <>
            <p>Domains</p>
            {savedDomains.map(domain => (
                <div className="domain-container">
                    {domain}
                    {currentPageDomain === domain ? ' (current)' : ''}
                    <span
                        className="delete-icon"
                        onClick={() => {
                            void deleteDomain(domain);
                        }}
                    >
                        <DeleteIcon />
                    </span>
                </div>
            ))}

            <div hidden={isDomainRegistered}>
                <p>
                    <b>Current page: </b>
                    {currentPageDomain}
                </p>
                <Button onClick={addCurrentDomain} title="Add current page" />
            </div>
        </>
    );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);
root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>,
);
