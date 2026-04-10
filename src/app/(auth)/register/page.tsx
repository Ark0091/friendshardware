'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { registerSchema, RegisterInput } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    try {
      const { data: regData } = await axios.post('/api/auth/register', data);
      if (regData.success) {
        await signIn('credentials', { email: data.email, password: data.password, redirect: false });
        toast.success('Account created successfully!');
        router.push('/');
      }
    } catch (error) {
      const msg = axios.isAxiosError(error) ? error.response?.data?.error : 'Registration failed';
      toast.error(msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-gray-900">Create account</h2>
      <p className="mb-6 text-sm text-gray-600">Join Friends Hardware for exclusive deals</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
          <Input placeholder="John Doe" {...register('name')} className={errors.name ? 'border-red-500' : ''} />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
          <Input type="email" placeholder="you@example.com" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number (optional)</label>
          <Input placeholder="10-digit mobile number" {...register('phone')} className={errors.phone ? 'border-red-500' : ''} />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <Input type={showPassword ? 'text' : 'password'} placeholder="Min 8 chars, 1 uppercase, 1 number" {...register('password')} className={`${errors.password ? 'border-red-500' : ''} pr-10`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
          <Input type="password" placeholder="Repeat password" {...register('confirmPassword')} className={errors.confirmPassword ? 'border-red-500' : ''} />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>
        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading} size="lg">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : 'Create Account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-orange-500 hover:text-orange-600">Sign in</Link>
      </p>
    </div>
  );
}
