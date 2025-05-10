
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}

const UserSearchBar = ({ searchTerm, onSearchChange, onRefresh }: UserSearchBarProps) => {
  return (
    <div className="flex gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-9"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <Button onClick={onRefresh} variant="outline">Refresh</Button>
    </div>
  );
};

export default UserSearchBar;
