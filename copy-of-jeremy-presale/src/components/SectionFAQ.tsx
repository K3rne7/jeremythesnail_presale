
import React, { useEffect, useRef, useState } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { animateElementOnScroll } from './gsap/animations';
import type { FAQItem } from '../types';

const faqData: FAQItem[] = [
  { question: 'What is $JEREMY?', answer: '$JEREMY is a revolutionary BEP-20 meme token on the Binance Smart Chain, led by the charismatic J-Snail. It\'s more than a token; it\'s a community, a vibe, and your ticket to the Snailverse!' },
  { question: 'How can I buy $JEREMY tokens?', answer: 'You can buy $JEREMY tokens during our presale event using BNB or USDT. Connect your wallet (MetaMask, Trust Wallet, etc.) to our official presale website and follow the simple steps in the "Buy Panel".' },
  { question: 'When can I claim my purchased tokens?', answer: 'Tokens purchased during the presale can be claimed after the presale event concludes. The claim function will be enabled on this website. See the "Claim Panel" for details.' },
  { question: 'What is the Snailverse?', answer: 'The Snailverse is our upcoming meme-powered metaverse where $JEREMY holders can interact, play games, and earn rewards. It\'s going to be slow, steady, and epic!' },
  { question: 'Is the smart contract audited?', answer: 'Yes, the $JEREMY presale and token contracts have been audited by a reputable third-party security firm. You can find the audit report link on our website (usually in the Footer or a dedicated "Audit" section).' },
  { question: 'Where can I find the Whitepaper?', answer: 'Our detailed Whitepaper is available for download. Check the links in the Hero section or Footer of this website.' },
];

const SectionFAQ: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      animateElementOnScroll(sectionRef.current.children);
    }
  }, []);

  return (
    <section id="faq" ref={sectionRef} className="py-16 md:py-24 bg-neutral-800 text-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12 md:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-secondary-light">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <Disclosure key={index} as="div" className="bg-neutral-700/50 rounded-lg shadow-lg border border-neutral-600">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-4 md:px-6 md:py-5 text-left text-lg font-medium text-neutral-100 hover:bg-neutral-600/50 focus:outline-none focus-visible:ring focus-visible:ring-primary-DEFAULT focus-visible:ring-opacity-75 rounded-t-lg transition-colors">
                    <span>{item.question}</span>
                    {open ? (
                      <ChevronUpIcon className="w-6 h-6 text-secondary-light" />
                    ) : (
                      <ChevronDownIcon className="w-6 h-6 text-neutral-400" />
                    )}
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-100 ease-in"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className="px-4 pt-2 pb-4 md:px-6 md:pt-3 md:pb-6 text-base text-neutral-300 bg-neutral-700/30 rounded-b-lg">
                      {item.answer}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionFAQ;
