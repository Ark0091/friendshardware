'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { forgotPasswordSchema } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { z } from 'zod';

type ForgotForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', data);
      setSent(true);
    } catch {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mb-4 text-4xl">📧</div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">Check your email</h2>
        <p className="mb-6 text-sm text-gray-600">We have sent a password reset link to your email address.</p>
        <Link href="/login"><Button variant="outline" className="w-full"><ArrowLeft className="mr-2 h-4 w-4" />Back to Login</Button></Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-gray-900">Forgot password?</h2>
      <p className="mb-6 text-sm text-gray-600">Enter your email to receive a reset link</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
          <Input type="email" placeholder="you@example.com" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</> : 'Send Reset Link'}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-gray-500 hover:text-orange-500 flex items-center justify-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
        </Link>
      </div>
    </div>
  );
}
