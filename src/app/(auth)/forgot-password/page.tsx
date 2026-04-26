"use client";

import { useState } from 'react';
import Link from 'next/link';
import { CheckIcon } from '@/components/icons';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/">
                        <h1 className="text-4xl font-bold text-accent mb-2">EcoEats</h1>
                    </Link>
                    <p className="text-stone-500 text-sm">Réinitialisation du mot de passe</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
                    {submitted ? (
                        <div className="flex flex-col items-center gap-5 text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                <CheckIcon size={32} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl font-bold text-stone-900">Email envoyé</h2>
                                <p className="text-stone-500 text-sm leading-relaxed">
                                    Si un compte existe pour{' '}
                                    <span className="font-semibold text-stone-700">{email}</span>,
                                    vous recevrez un lien de réinitialisation dans quelques minutes.
                                </p>
                                <p className="text-stone-400 text-xs">Vérifiez également vos spams.</p>
                            </div>
                            <button
                                onClick={() => { setSubmitted(false); setEmail(''); }}
                                className="cursor-pointer text-sm text-accent font-semibold hover:underline"
                            >
                                Réessayer avec une autre adresse
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-stone-900 mb-2">Mot de passe oublié ?</h2>
                            <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                                        Adresse email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-accent/30 focus:border-accent outline-none transition text-sm placeholder:text-stone-400"
                                        placeholder="votre@email.com"
                                        autoComplete="email"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="cursor-pointer w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95"
                                    style={{ background: 'linear-gradient(to right, var(--primary), var(--accent))' }}
                                >
                                    Envoyer le lien de réinitialisation
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <div className="mt-6 text-center text-sm text-stone-500">
                    <Link href="/login" className="text-accent font-semibold hover:underline">
                        ← Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}
