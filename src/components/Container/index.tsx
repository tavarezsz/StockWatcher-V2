type ContainerProps = {
  children: React.ReactNode;
};

export function Container({children}: ContainerProps){
    return(
        <div className=" flex flex-col w-full h-full p-8 bg-background-sec gap-7">
            {children}
        </div>
    )
}