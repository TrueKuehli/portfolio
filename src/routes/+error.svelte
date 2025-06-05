<script lang="ts">
    import { page } from '$app/state';

    import HeartCrack from "@lucide/svelte/icons/heart-crack";
</script>


<div class="flex flex-col items-center justify-center h-screen/2">
    <article class="prose text-center lg:prose-xl my-4">
        <HeartCrack class="w-1/3 h-1/3 mx-auto my-4 text-accent" />
        <h1 style="margin-bottom: 1rem;">{page.error?.message}</h1>
        <span style="margin-top: 0;">Error code: {page.status}</span>

        <p>
            The page you are looking for does not exist or an error has occurred.
        </p>

        <a href="/" class="btn btn-accent btn-lg mt-4">
            Return Home
        </a>
    </article>
</div>
