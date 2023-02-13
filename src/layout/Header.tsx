import { Fragment } from "react";

import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, WalletIcon } from '@heroicons/react/24/outline';

import { NavLink } from "react-router-dom";

import { useWeb3React } from "@web3-react/core";

import { useCrokachu } from "../contexts/CrokachuContext";

import { routes } from '../App';

import { classNames } from "../utilities/classNames";
import Logo from "../components/Logo";

export default function Header() {
    const { account, deactivate } = useWeb3React();
    const { balance } = useCrokachu();

    return (
        <header className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-tr from-purple-700 to-purple-900">
            <Disclosure as="nav">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="flex items-center sm:hidden">
                                    {/* Mobile menu button*/}
                                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-purple-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex flex-shrink-0 items-center">
                                        <NavLink to="/">
                                            <Logo />
                                        </NavLink>
                                        {/*<img
                                            className="block h-8 w-auto lg:hidden"
                                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                            alt="Your Company"
                                        />
                                        <img
                                            className="hidden h-8 w-auto lg:block"
                                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                            alt="Your Company"
                                        />*/}
                                    </div>
                                    <div className="hidden sm:ml-6 sm:block">
                                        <div className="flex space-x-4">
                                            {routes.map(({ path, name }) => (
                                                <NavLink
                                                    key={name}
                                                    to={path}
                                                    className={({ isActive }) => (classNames(isActive ? 'bg-purple-900 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium'))}
                                                >
                                                    {name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    {/*<button
                                        type="button"
                                        className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    >
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>*/}

                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            {!account ?
                                                <Menu.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-purple-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" disabled>
                                                    <WalletIcon className="block h-6 w-6 text-gray-400" aria-hidden="true" />
                                                </Menu.Button> : <Menu.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-purple-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                                    <span className="sr-only">Open user menu</span>
                                                    <WalletIcon className="block h-6 w-6 text-white" aria-hidden="true" />
                                                </Menu.Button>
                                            }
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <Menu.Item>
                                                    <div className="block px-4 py-2 text-sm text-gray-700 text-center">
                                                        {account?.slice(0, 4)}...{account?.slice(account.length - 3, account.length)}
                                                    </div>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <div className="block px-4 py-2 text-sm text-gray-700 text-center">
                                                        {balance} CRO
                                                    </div>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button onClick={deactivate}
                                                            className={classNames(active ? 'bg-gray-100' : '', 'block mx-auto text-center px-4 py-2 text-sm text-gray-700')}
                                                        >
                                                            Disconnect
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Disclosure.Panel className="sm:hidden">
                                {({ close }) => (
                                    <div className="space-y-1 px-2 pt-2 pb-3">
                                        {routes.map(({ path, name }) => (
                                            <Disclosure.Button
                                                key={name} className="block"

                                            >
                                                <NavLink onClick={() => close()} to={path}
                                                    className={({ isActive }: any) => (classNames(isActive ? 'bg-purple-900 text-white' : 'text-gray-300 hover:bg-purple-800 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium'))}>
                                                    {name}
                                                </NavLink>
                                            </Disclosure.Button>
                                        ))}
                                    </div>
                                )}
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>
        </header>
    )
}
