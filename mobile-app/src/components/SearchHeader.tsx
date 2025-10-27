import React from 'react';
import { View, Platform } from 'react-native';
import { Input } from '../components/ui/Input';
import { Search } from 'lucide-react-native';

type SearchHeaderProps = {
  value: string;
  onChange: (value: string) => void;
};

const SearchHeader = ({ value, onChange }: SearchHeaderProps) => {
  return (
    <View className="px-4 pt-4 pb-2 bg-background" style={{
      paddingTop: Platform.OS === 'android' ? 16 : 8
    }}>
      <View className="relative">
        <Input
          placeholder="Search jobs, companies..."
          className="pl-10 h-12 text-base bg-gray-50 border-gray-200"
          value={value}
          onChangeText={onChange}
        />
        <View className="absolute left-3 top-0 h-full items-center justify-center">
          <Search className="text-muted-foreground" size={20} />
        </View>
      </View>
    </View>
  );
};

export default SearchHeader;
