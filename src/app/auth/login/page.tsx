'use client'
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Github, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState } from "react";
import { loginApi } from "@/redux-stores/slice/auth/api.service";
import { ApiResponse, Session } from "@/types";
import { getSessionApi } from "@/redux-stores/slice/account/api.service";
import { useDispatch } from "react-redux";

const FormSchema = z.object({
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email.",
    }),
});

type FormData = z.infer<typeof FormSchema>;

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const { handleSubmit, register, reset, formState: { errors } } = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            password: "",
            email: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            const { password, email } = data;
            // const callbackUrlPath = new URL(window.location.href).searchParams.get("callbackUrl")
            const res = await loginApi({ email, password }) as ApiResponse<Session>
            if (!res.data) {
                toast.error(res.message)
            }
            if (res.data) {
                dispatch(getSessionApi() as any)
                toast.success('Login Successful')
                location.replace(new URL(window.location.href).searchParams.get("callbackUrl") || "/")
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[100dvh] p-1 flex justify-center items-center w-full">
            <Card className="md:w-96 md:h-auto w-full h-full pt-16 md:pt-0 rounded-3xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">
                        Sign In
                    </CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" {...register("email", { required: true })} />
                        <div className="h-4 w-full text-center mb-2">
                            {errors.email ? <span className="text-red-500">{errors.email?.message}</span> : <></>}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password"  {...register("password", { required: true })} />
                        <div className="h-4 w-full text-center mb-2">
                            {errors.password ? <span className="text-red-500">{errors.password?.message}</span> : <></>}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Create an account?
                                <span className="text-primary-foreground cursor-pointer text-sky-400  ml-1"
                                    onClick={() => router.replace(`/auth/register`)}>
                                    Sign Up
                                </span>
                            </span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        disabled={loading}
                        onClick={handleSubmit(onSubmit)}
                        className="w-full">
                        {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}