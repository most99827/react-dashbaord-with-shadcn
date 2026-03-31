import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { useMemo } from 'react';
import { store, update } from '@/routes/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchableSelect } from '@/components/searchable-select';
import { User } from '@/types';

interface SysAdminGroup {
    id: number;
    group_name: string;
}

interface UserFormProps {
    user: User | null;
    sys_admin_groups: SysAdminGroup[];
    supervisors: User[];
    onSuccess: () => void;
    onCancel: () => void;
}

const USER_TYPES = [
    { value: '1', label: 'Admin' },
    { value: '2', label: 'Supervisor' },
    { value: '3', label: 'Sales Rep' },
    { value: '4', label: 'Inventory' },
];

interface UserFormData {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    user_type_id: string;
    supervisor_id: string;
    active_flag: boolean;
    admin_group_ids: string[];
}

export default function UserForm({ user, sys_admin_groups, supervisors, onSuccess, onCancel }: UserFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm<UserFormData>({
        first_name: (user?.first_name as string) || '',
        last_name: (user?.last_name as string) || '',
        username: (user?.username as string) || '',
        email: user?.email || '',
        password: '',
        user_type_id: (user?.user_type_id as string | undefined)?.toString() || '1',
        supervisor_id: (user?.supervisor_id as string | undefined)?.toString() || '',
        active_flag: (user?.active_flag as boolean) ?? true,
        admin_group_ids: (user?.security_groups as any[])?.map(g => g.id.toString()) || [],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                reset();
                onSuccess();
            }
        };

        if (user) {
            put(update({ user: user.id }).url, options);
        } else {
            post(store().url, options);
        }
    };

    const loadGroups = async (query: string) => {
        const response = await axios.get('/setup/groups/search', { params: { query } });
        return response.data;
    };

    const loadEmails = async (query: string) => {
        const prefix = data.user_type_id === '2' ? 'supervisors' : 'sales-reps';
        const response = await axios.get(`/get-select-data/${prefix}`, {
            params: { searchText: query }
        });

        if (response.data.success && response.data.items) {
            return response.data.items.map((item: any) => ({
                value: item.text.split(' - ')[0],
                label: item.text,
                original: item
            }));
        }
        return [];
    };

    const groupOptions = useMemo(() => sys_admin_groups.map(group => ({
        value: group.id.toString(),
        label: group.group_name
    })), [sys_admin_groups]);

    const supervisorOptions = useMemo(() => supervisors.map(s => ({
        value: s.id.toString(),
        label: `${s.first_name} ${s.last_name} (${s.email})`
    })), [supervisors]);

    const handleEmailSelect = (email: string | string[]) => {
        if (Array.isArray(email)) return;

        setData('email', email);

        // Find the selected option details (this would come from the AJAX response which we should handle in the search component or here)
        // For simplicity, let's assume we fetch details or the SearchableSelect passes the full object
        // In this implementation, we'll need to fetch more data or have it in the result
        axios.get(`/setup/users/email-details`, { params: { email } }).then(response => {
            if (response.data.success) {
                const details = response.data.data;
                setData(prev => ({
                    ...prev,
                    email: details.email,
                    first_name: details.first_name,
                    last_name: details.last_name,
                    username: details.username,
                    supervisor_id: details.supervisor_id?.toString() || prev.supervisor_id
                }));
            }
        });
    };

    const isInternalUser = data.user_type_id === '1' || data.user_type_id === '4';
    const showSecurityGroups = data.user_type_id === '1' || data.user_type_id === '2' || data.user_type_id === '4';
    const showSupervisor = data.user_type_id === '3';

    return (
        <Card className="mt-8 border-2 border-primary/20">
            <CardHeader>
                <CardTitle>{user ? 'Edit User' : 'Create New User'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="user_type_id" className="text-sm font-medium">User Type</Label>
                            <SearchableSelect
                                value={data.user_type_id}
                                onValueChange={(value) => {
                                    setData('user_type_id', value as string);
                                    if (!user) {
                                        // Reset fields on type change for new users
                                        setData(prev => ({
                                            ...prev,
                                            user_type_id: value as string,
                                            email: '',
                                            first_name: '',
                                            last_name: '',
                                            username: '',
                                            supervisor_id: ''
                                        }));
                                    }
                                }}
                                options={USER_TYPES}
                                placeholder="Select User Type"
                                className="mt-1"
                            />
                            {errors.user_type_id && <span className="text-red-500 text-xs mt-1 block">{errors.user_type_id}</span>}
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            {isInternalUser ? (
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1"
                                    placeholder="john@example.com"
                                    required
                                />
                            ) : (
                                <SearchableSelect
                                    value={data.email}
                                    onValueChange={handleEmailSelect}
                                    options={[]}
                                    loadOptions={loadEmails}
                                    placeholder="Search Email..."
                                    className="mt-1"
                                />
                            )}
                            {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
                        </div>

                        <div>
                            <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                            <Input
                                id="username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="mt-1"
                                placeholder="johndoe"
                                required
                            />
                            {errors.username && <span className="text-red-500 text-xs mt-1 block">{errors.username}</span>}
                        </div>

                        <div>
                            <Label htmlFor="first_name" className="text-sm font-medium">First Name</Label>
                            <Input
                                id="first_name"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                className="mt-1"
                                placeholder="John"
                                required
                            />
                            {errors.first_name && <span className="text-red-500 text-xs mt-1 block">{errors.first_name}</span>}
                        </div>

                        <div>
                            <Label htmlFor="last_name" className="text-sm font-medium">Last Name</Label>
                            <Input
                                id="last_name"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                className="mt-1"
                                placeholder="Doe"
                                required
                            />
                            {errors.last_name && <span className="text-red-500 text-xs mt-1 block">{errors.last_name}</span>}
                        </div>

                        <div>
                            <Label htmlFor="password" title={user ? 'Leave blank to keep current' : ''} className="text-sm font-medium">
                                Password {user && '(Optional)'}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1"
                                required={!user}
                            />
                            {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
                        </div>

                        {showSupervisor && (
                            <div>
                                <Label htmlFor="supervisor_id" className="text-sm font-medium">Supervisor</Label>
                                <SearchableSelect
                                    value={data.supervisor_id}
                                    onValueChange={(value) => setData('supervisor_id', value as string)}
                                    options={supervisorOptions}
                                    placeholder="Select Supervisor"
                                    className="mt-1"
                                />
                                {errors.supervisor_id && <span className="text-red-500 text-xs mt-1 block">{errors.supervisor_id}</span>}
                            </div>
                        )}

                        {showSecurityGroups && (
                            <div className="col-span-full">
                                <Label htmlFor="admin_group_ids" className="text-sm font-medium">Security Groups</Label>
                                <div className="mt-1">
                                    <SearchableSelect
                                        value={data.admin_group_ids}
                                        onValueChange={(value) => setData('admin_group_ids', value as string[])}
                                        options={groupOptions}
                                        loadOptions={loadGroups}
                                        placeholder="Add Security Groups..."
                                        multiple
                                    />
                                </div>
                                {errors.admin_group_ids && <span className="text-red-500 text-xs mt-1 block">{errors.admin_group_ids}</span>}
                            </div>
                        )}

                        <div className="flex items-center space-x-2 mt-4 col-span-full">
                            <input
                                type="checkbox"
                                id="active_flag"
                                checked={data.active_flag}
                                onChange={(e) => setData('active_flag', e.target.checked)}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer transition-all"
                            />
                            <Label htmlFor="active_flag" className="text-sm font-medium cursor-pointer">Active Account</Label>
                            {errors.active_flag && <span className="text-red-500 text-xs ml-2">{errors.active_flag}</span>}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <Button type="submit" disabled={processing} className="min-w-32">
                            {user ? 'Update User' : 'Create User'}
                        </Button>
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
