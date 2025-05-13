import { createClient } from '@/lib/server'

export default async function UserId(){
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        console.log(`Eror`)
    }
    const user: stirng =data?.user.id
    return user
}