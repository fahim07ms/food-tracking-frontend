"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
// Assuming you have this store setup, otherwise remove or mock it
import { useAuthStore } from "@/store/useAuthStore"

// FIX: z.email() does not exist on the root. It must be z.string().email()
const registerSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    // z.coerce is correct here for handling HTML input type="number" which returns strings
    householdSize: z.coerce.number().min(1, { message: "Household size must be at least 1" }),
    dietaryPreference: z.string().min(1, { message: "Please select a dietary preference" }),
})

export default function RegisterPage() {
    const router = useRouter()
    // distinct check to ensure store exists, optional chaining if store might be undefined
    const login = useAuthStore((state) => state.login)
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            householdSize: 1,
            dietaryPreference: "",
        },
    })

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log(values) // For debugging

        // Mock register & login
        if (login) {
            login({
                id: Math.random().toString(36).substr(2, 9),
                name: values.name,
                email: values.email,
                householdSize: values.householdSize,
                dietaryPreferences: [values.dietaryPreference],
            })
        }

        setIsLoading(false)
        router.push("/dashboard")
    }

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                    Enter your information to create your account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="m@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="householdSize"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Household Size</FormLabel>
                                        <FormControl>
                                            {/* field.onChange matches the z.coerce in schema */}
                                            <Input type="number" min="1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dietaryPreference"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dietary Preference</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="None">None</SelectItem>
                                                <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                                                <SelectItem value="Vegan">Vegan</SelectItem>
                                                <SelectItem value="Gluten-Free">Gluten-Free</SelectItem>
                                                <SelectItem value="Keto">Keto</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Account
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}