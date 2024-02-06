import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from 'utils';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from 'components/ui/form';
import { Input } from 'components/ui/input';
import { Calendar } from 'components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from 'components/ui/popover';
import { Button } from 'components/ui/button';
import { Separator } from 'components/ui/separator';

const FormFieldNameAndBirthday = ({ control }) => (
    <>
        <h2 className='font-semibold'>Tell us your full name as it appears on your government issue ID</h2>
        <div className='grid grid-cols-2 gap-2'>
            <FormField
                control={control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter first Name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            <FormField
                control={control}
                name="middleName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter middle Name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            <FormField
                control={control}
                name="lastName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter last Name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            <FormField
                control={control}
                name="suffix"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Suffix (optional)</FormLabel>
                        <FormControl>
                            <Input placeholder="Select one" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
        </div>
        <Separator />
        <BirthdayPicker control={control} />
    </>
);

const BirthdayPicker = ({ control }) => (
    <FormField
        control={control}
        name="dob"
        render={({ field }) => (
            <FormItem className="flex flex-col">
                <div className="md:flex md:space-x-1">
                    <h2 className='font-bold text-sm'>When is your birthday?</h2>
                    <p className='text-sm'>(You must be at least 18 years old to open an account)</p>
                </div>
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                variant={'outline'}
                                className={cn(
                                    'w-[240px] pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                )}
                            >
                                {field.value ? (
                                    format(field.value, 'PP')
                                ) : (
                                    <span>mm/dd/yyy</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            initialFocus
                            classNames={{
                                caption: '',
                                caption_label: 'hidden'
                            }}
                            captionLayout="dropdown"
                            fromYear={1980}
                            toYear={2025} />
                    </PopoverContent>
                </Popover>

                <FormMessage />
            </FormItem>
        )} />
);

export default FormFieldNameAndBirthday;
