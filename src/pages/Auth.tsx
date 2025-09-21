import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const AuthPage = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        const displayName = `${firstName} ${lastName}`.trim();
        await signUp(email, password, displayName || undefined);
      } else {
        await signIn(email, password);
      }
      navigate('/');
    } catch (err: any) {
      const code = err?.code as string | undefined;
      const friendly =
        code === 'auth/invalid-credential' || code === 'auth/wrong-password' ? 'Invalid email or password.' :
        code === 'auth/user-not-found' ? 'No user found with this email.' :
        code === 'auth/email-already-in-use' ? 'Email already in use. Try signing in.' :
        err.message ?? 'Authentication failed';
      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            {mode === 'signup' ? 'Create an account' : 'Sign in to your account'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm block mb-1">First name</label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required={mode==='signup'} />
                </div>
                <div>
                  <label className="text-sm block mb-1">Last name</label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
            )}
            <div>
              <label className="text-sm block mb-1">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm block mb-1">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Please wait...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
          <div className="my-4 flex items-center gap-3">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px bg-border flex-1" />
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              setError(null);
              setLoading(true);
              try {
                await signInWithGoogle();
                navigate('/');
              } catch (err: any) {
                setError('Google sign-in failed');
              } finally {
                setLoading(false);
              }
            }}
          >
            Continue with Google
          </Button>
          <div className="text-sm text-muted-foreground mt-4 text-center">
            {mode === 'signup' ? (
              <button className="underline" onClick={() => setMode('signin')}>Already have an account? Sign in</button>
            ) : (
              <button className="underline" onClick={() => setMode('signup')}>New here? Create an account</button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
