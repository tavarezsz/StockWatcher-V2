type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({children, className = ''}: ContainerProps){
    return(
        <div className={`flex h-full w-full flex-col gap-7 bg-background-sec p-8 ${className}`}>
            {children}
        </div>
    )
}
