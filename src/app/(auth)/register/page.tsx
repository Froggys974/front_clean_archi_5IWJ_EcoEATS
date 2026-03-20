"use client";

import { useState } from 'react';
import { apiRequest } from '@/services/api';
import { RegisterResponse } from '@/types/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'client' as 'client' | 'courier'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const endpoint = formData.role === 'client' ? '/auth/register/client' : '/auth/register/courier';
      
      // Remove role from payload as API doesn't expect it in the body for specific endpoints
      const { role, ...payload } = formData;
      
      await apiRequest<RegisterResponse>(endpoint, 'POST', payload);

      setSuccess('Inscription réussie ! Vous allez être redirigé vers la page de connexion.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/">
            <h1 className="text-4xl font-bold text-accent mb-2">EcoEats</h1>
          </Link>
          <p className="text-gray-600">Rejoignez-nous</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Inscription</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                placeholder="06..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                placeholder="********"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Je suis un...
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
              >
                <option value="client">Client</option>
                <option value="courier">Livreur</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-accent font-semibold hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

