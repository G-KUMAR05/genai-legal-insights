import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="flex items-center justify-between px-6 py-4 border-t border-border bg-background">
      <p className="text-muted-foreground text-sm">
        Made for Hackathon • AI responses are suggestions, not legal advice.
      </p>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          Integrate AI
        </Button>
        <Button variant="outline" size="sm">
          Export PDF
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
