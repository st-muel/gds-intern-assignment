import { Autocomplete, AutocompleteItem, Avatar, Button } from "@nextui-org/react";

import type { StaffWithTeamAndRedemptions } from "../../../types";

interface props {
    setSearch: (search: string) => void;
    items: StaffWithTeamAndRedemptions[];
    loading: boolean;
}

export const SearchBar = (props: props) => {
    return (
        <Autocomplete
            aria-label="Search for staff by ID"
            defaultItems={props.items}
            placeholder="Search..."
            isLoading={props.loading}
            classNames={{
                base: "max-w-sm",
                listboxWrapper: "max-h-[320px]",
                selectorButton: "text-default-500"
            }}
            inputProps={{
                classNames: {
                    input: "ml-1",
                    inputWrapper: "h-[48px]",
                },
            }}
            listboxProps={{
                hideSelectedIcon: true,
                itemClasses: {
                    base: [
                        "rounded-medium",
                        "text-default-500",
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "dark:data-[hover=true]:bg-default-50",
                        "data-[pressed=true]:opacity-70",
                        "data-[hover=true]:bg-default-200",
                        "data-[selectable=true]:focus:bg-default-100",
                        "data-[focus-visible=true]:ring-default-500",
                    ],
                },
            }}
            onInputChange={(value) => {
                props.setSearch(value);
            }}
            onKeyDown={(e: any) => e.continuePropagation()}
        >
            {
                (item) => (
                    <AutocompleteItem key={ item.id } textValue={ item.id }>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                <Avatar 
                                    alt={ item.id } 
                                    className="flex-shrink-0" 
                                    size="sm" 
                                    name={ item.id[0] } 
                                    showFallback 
                                />
                                <div className="flex flex-col">
                                    <span className="text-small">{ item.id }</span>
                                    <span className="text-tiny text-default-400">{ item.team.name }</span>
                                </div>
                            </div>
                            <Button
                                className="border-small mr-0.5 font-medium shadow-small"
                                radius="full"
                                size="sm"
                                variant="bordered"
                            >
                                Select
                            </Button>
                        </div>
                    </AutocompleteItem>
                )
            }
        </Autocomplete>
    );
}