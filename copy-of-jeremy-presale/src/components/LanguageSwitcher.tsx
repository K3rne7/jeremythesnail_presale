import React, { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' }, // Example flag
  { code: 'jp', name: '日本語', flag: '🇯🇵' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find(lang => lang.code === i18n.language) || languages.find(lang => lang.code === i18n.languages[0].split('-')[0]) || languages[0]
  );

  const changeLanguage = (lang: typeof languages[0]) => {
    i18n.changeLanguage(lang.code);
    setSelectedLanguage(lang);
  };
  
  // Update selectedLanguage if i18n.language changes externally
  React.useEffect(() => {
    const currentLang = languages.find(lang => lang.code === i18n.language) || languages.find(lang => lang.code === i18n.languages[0].split('-')[0]);
    if (currentLang && currentLang.code !== selectedLanguage.code) {
      setSelectedLanguage(currentLang);
    }
  }, [i18n.language, i18n.languages, selectedLanguage.code]);


  return (
    <div className="relative z-50">
      <Listbox value={selectedLanguage} onChange={changeLanguage}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-neutral-700 py-2 pl-3 pr-10 text-left text-neutral-100 shadow-md focus:outline-none focus-visible:border-primary-DEFAULT focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-light sm:text-sm hover:bg-neutral-600 transition-colors">
            <span className="block truncate"><span className="mr-2">{selectedLanguage.flag}</span>{selectedLanguage.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-auto min-w-full overflow-auto rounded-md bg-neutral-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {languages.map((lang) => (
                <Listbox.Option
                  key={lang.code}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-primary-DEFAULT text-white' : 'text-neutral-100'
                    }`
                  }
                  value={lang}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                       <span className="mr-2">{lang.flag}</span> {lang.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary-light">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default LanguageSwitcher;
