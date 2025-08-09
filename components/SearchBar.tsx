import React, { useState } from 'react'
import { View } from 'react-native';
import TextInput from './base/TextInput'
import { Search as SearchIcon } from 'lucide-react-native';

type SearchBarProps = {
    searchQuery: string | undefined,
    setSearchQuery: (text: string) => void
}

export default function SearchBar({
    searchQuery,
    setSearchQuery
}: SearchBarProps) {
    return (
        <View className='flex flex-row border p-3 rounded-3xl'>
            <SearchIcon size={20} color="#6b7280" />
            <TextInput
                placeHolder='Search'
                value={searchQuery}
                setValue={setSearchQuery}
                keyboardType='default'
            />
        </View>
    )
}