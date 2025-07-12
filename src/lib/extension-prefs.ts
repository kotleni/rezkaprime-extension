const defaultDomains: string[] = [
    'hdrezka.ag',
    'hdrezka.cm',
    'hdrezka.me',
    'hdrezka.co',
];

export interface Prefs {
    savedDomains: string[];
}

export class ExtensionPrefs {
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
