import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta ao MusicStream"
      });
      navigate('/');
    } else {
      toast({
        title: "Erro no login",
        description: result.error,
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-purple-500/20">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <Music className="w-10 h-10 text-purple-500" />
              <span className="text-white font-bold text-2xl">MusicStream</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2">Bem-vindo de volta</h1>
          <p className="text-gray-400 text-center mb-8">Faça login para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-900/50 border-gray-700 text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Senha</label>
              <Input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-900/50 border-gray-700 text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12 text-lg font-semibold"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;