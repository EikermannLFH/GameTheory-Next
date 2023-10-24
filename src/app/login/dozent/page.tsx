"use client"

import { useRouter } from 'next/router';
import React, {MouseEventHandler, useState} from 'react';
import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from "react-firebase-hooks/auth";
import { IconCheck, IconExclamationCircle } from '@tabler/icons-react';
import {
    Button,
    Container,
    Center,
    Paper,
    PasswordInput,
    Loader,
    Stack,
    TextInput,
    Title
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import firebase from "../../firebaseApp";

export default function DozentLogin() {
    const auth = getAuth(firebase);
    const [email, setEmail] = useState('');
    const [profPasswort, setProfPasswort] = useState('');
    const [user, loading, error] = useAuthState(auth);
    //const router = useRouter();

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        notifications.show({
            id: 'load-data',
            color: "brand.0",
            loading: true,
            title: 'Versuche Login',
            message: 'Du kannst das noch nicht schließen.',
            autoClose: false,
            withCloseButton: false,
        });
        if (email === '' || profPasswort === '') {
            notifications.update({
                id: 'load-data',
                loading: false,
                color: 'red',
                title: 'Upps😵‍💫',
                message: 'Bitte geben Sie ihre Nutzerinformaitonen ein!',
                icon: <IconExclamationCircle size="1rem" />
            });
        } else {
            try {
                await signInWithEmailAndPassword(auth, email, profPasswort);
                notifications.update({
                    id: 'load-data',
                    loading: false,
                    color: 'teal',
                    title: 'Success',
                    message: 'Login erfolgreich',
                    icon: <IconCheck size="1rem" />
                });
                //router.push('/overview');
            } catch (error) {
                console.error(error);
                notifications.update({
                    id: 'load-data',
                    loading: false,
                    color: 'red',
                    title: 'Upps, Anmeldung fehlgeschlagen. 😕',
                    message: 'Bitte überprüfe deine Anmeldeinformationen!',
                    icon: <IconExclamationCircle size="1rem" />
                });
            }
        }
    };

    if (user) {
        //router.push('/overview');
    } else {
        if (loading) {
            return (
                <Center>
                    <Loader />
                </Center>
            );
        } else {
            return (
                <Center bg="brand.7" style={{ height: '100%' }}>
                    <Container size={800} my={40}>
                        <Title
                            c="white"
                            ta="center"
                            style={{ fontFamily: 'Castellar, sans-serif', fontWeight: 800 }}
                        >
                            Game Theory
                        </Title>
                        <Paper miw={300} withBorder shadow="md" p={20} mt={20} radius="md">
                            <Stack gap="sm">
                                <TextInput
                                    label="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
                                />
                                <PasswordInput
                                    placeholder="Password"
                                    label="Password"
                                    value={profPasswort}
                                    onChange={(e) => setProfPasswort(e.target.value.replace(/\s/g, ''))}
                                />
                                <Button onClick={handleSubmit} fullWidth my="xl">
                                    Login
                                </Button>
                            </Stack>
                            <Stack align="center" gap="xs">
                                <Link href="/" style={{ textDecoration: 'none' }}>
                                    Passwort vergessen?
                                </Link>
                                <Link href="/" style={{ textDecoration: 'none' }}>Registrieren</Link>
                            </Stack>
                            <Link href="/" style={{ textDecoration: 'none' }}>
                                <Container fz={14} c={'darkgray'} ta={"right"} w={110} mr={0} p={0}>
                                    Studenten Login
                                    <Center><i className="fa fa-chevron-right"></i></Center>
                                </Container>
                            </Link>
                        </Paper>
                    </Container>
                </Center>
            );
        }
    }
}