import i18next from 'i18next';
import en from 'translation/en.json' assert {type: 'json'};
import th from 'translation/th.json' assert {type: 'json'};


export default class LocaleSingleton {
    private static instance: LocaleSingleton;

    private constructor() {
        if (i18next.isInitialized) return
        i18next.init({
            lng: 'th',
            debug: false,
            resources: {
                en: {
                    translation: en
                },
                th: {
                    translation: th
                }
            }
        });
    }

    public static getInstance(): LocaleSingleton {
        if (!LocaleSingleton.instance) {
            LocaleSingleton.instance = new LocaleSingleton();
        }

        return LocaleSingleton.instance;
    }
}