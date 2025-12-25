import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
          <span className="font-bold text-accent-foreground">GA</span>
        </div>
        <h1 className="text-xl font-semibold">GenAI LeGaL — Contract Companion</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          English
        </Button>
        <Button variant="ghost" size="sm">
          Light Mode
        </Button>
        <Button variant="default" size="sm">
          Login
        </Button>
      </div>
    </header>
  );
};

export default Header;
