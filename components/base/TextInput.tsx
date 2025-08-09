import { View, TextInput as RNTextInput, KeyboardTypeOptions } from 'react-native'
import React from 'react'

type TextInputType = {
    value: string | undefined;
    setValue: (text: string) => void;
    placeHolder: string;
    keyboardType: KeyboardTypeOptions;
    className?: string;
}

export default function TextInput({
    value,
    setValue,
    placeHolder,
    keyboardType,
    className
}: TextInputType) {
  return (
      <RNTextInput 
        className={`flex-1 ${className}`}
        value={value}
        placeholder={placeHolder}
        onChangeText={setValue}
        keyboardType={keyboardType}
      />
  )
}