'use client';

import { useCallback, useRef } from 'react';
import { Button, Spinner } from '@material-tailwind/react';
import { uploadFile } from 'actions/storageActions';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from 'app/config/ReactQueryClientProvider';
import { useDropzone } from 'react-dropzone';

export default function FileDragDropZone() {
    const fileRef = useRef(null);
    const uploadImageMutation = useMutation({
        mutationFn: uploadFile,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['images'],
            });
        },
    });

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            // 서버로 이미지, 파일 등을 보낼 때는 주로 FormData
            // FormData 객체란 단순한 객체가 아니며 XMLHttpRequest 전송을 위하여 설계된 특수한 객체 형태
            const formData = new FormData();

            acceptedFiles?.forEach((file) => {
                formData.append(file?.name, file);
            });

            const result = await uploadImageMutation.mutate(formData);
            console.log(result);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

    return (
        <div
            {...getRootProps()}
            // onSubmit={async (e) => {
            //     e.preventDefault();

            //     const file = fileRef?.current?.files?.[0];
            //     if (file) {
            //         // 서버로 이미지, 파일 등을 보낼 때는 주로 FormData
            //         // FormData 객체란 단순한 객체가 아니며 XMLHttpRequest 전송을 위하여 설계된 특수한 객체 형태
            //         const formData = new FormData();
            //         formData.append('file', file);
            //         const result = await uploadImageMutation.mutate(formData);
            //         console.log(result);
            //     }
            // }}
            className="w-full py-20 border-4 border-dotted border-indigo-700 flex flex-col items-center justify-center cursor-pointer"
        >
            <input {...getInputProps()} />
            {uploadImageMutation.isPending ? (
                <Spinner />
            ) : isDragActive ? (
                <p>파일을 놓아주세요.</p>
            ) : (
                <p>파일을 여기에 끌어다 놓거나 클릭하여 업로드하세요.</p>
            )}
            {/* <Button loading={uploadImageMutation?.isPending} type="submit">
                파일 업로드
            </Button> */}
        </div>
    );
}
