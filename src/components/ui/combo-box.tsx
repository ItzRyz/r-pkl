"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

export type ComboType = {
  value: string;
  label: string;
};

const PopoverTriggerComponent = ({
  value,
  data,
  placeholder,
  open,
}: {
  value: string;
  data: ComboType[];
  placeholder: string;
  open: boolean;
}) => {
  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn(
          "w-full justify-between",
          !value && "text-muted-foreground"
        )}
      >
        {value ? data.find((d) => d.value === value)?.label : placeholder}
        <ChevronsUpDown className="opacity-50" />
      </Button>
    </PopoverTrigger>
  );
};

const PopoverContentComponent = ({
  data,
  value,
  setValue,
  setOpen,
  searchText,
}: {
  data: ComboType[];
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  searchText: string;
}) => {
  return (
    <PopoverContent className="w-full p-0">
      <Command>
        <CommandInput placeholder={searchText} className="h-9" />
        <CommandListComponent
          data={data}
          value={value}
          setValue={setValue}
          setOpen={setOpen}
        />
      </Command>
    </PopoverContent>
  );
};

const CommandListComponent = ({
  data,
  value,
  setValue,
  setOpen,
}: {
  data: ComboType[];
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <CommandList>
      <CommandEmpty>No framework found.</CommandEmpty>
      <CommandGroup>
        {data.map((d) => (
          <CommandItem
            key={d.value}
            value={d.value}
            onSelect={(currentValue) => {
              setValue(currentValue === value ? "" : currentValue);
              setOpen(false);
            }}
          >
            {d.label}
            <Check
              className={cn(
                "ml-auto",
                value === d.value ? "opacity-100" : "opacity-0"
              )}
            />
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  );
};

export const ComboBox = ({
  data,
  placeholder,
  searchText,
  value,
  setValue,
  open,
  setOpen,
}: {
  data: ComboType[];
  placeholder: string;
  searchText: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTriggerComponent
        value={value}
        data={data}
        placeholder={placeholder}
        open={open}
      />
      <PopoverContentComponent
        data={data}
        value={value}
        setValue={setValue}
        setOpen={setOpen}
        searchText={searchText}
      />
    </Popover>
  );
};
